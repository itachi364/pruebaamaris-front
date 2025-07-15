import React, { useEffect, useState } from 'react';
import {
  getFunds,
  subscribeToFund,
  getUserBalancesAll,
  getUserBalances
} from '../api/fundApi';
import {
  Fund,
  NotificationType,
  UserBalance,
  UserBalanceRequest
} from '../types';
import {
  Container,
  Form,
  Button,
  Alert,
  Table,
  Row,
  Col,
  InputGroup,
  Pagination
} from 'react-bootstrap';

export default function SubscribePage() {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [userId, setUserId] = useState('');
  const [searchUserId, setSearchUserId] = useState('');
  const [selectedFundId, setSelectedFundId] = useState('');
  const [amount, setAmount] = useState('');
  const [notificationType, setNotificationType] = useState<NotificationType>('EMAIL');
  const [message, setMessage] = useState('');
  const [messageVariant, setMessageVariant] = useState<'success' | 'danger'>('success');
  const [userBalances, setUserBalances] = useState<UserBalance[]>([]);

  // Paginación
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getFunds()
      .then(response => setFunds(response.data))
      .catch(() => {
        setMessage('Error al cargar los fondos.');
        setMessageVariant('danger');
      });

    fetchAllBalances();
  }, []);

  const fetchAllBalances = () => {
    getUserBalancesAll()
      .then(res => {
        setUserBalances(res.data);
        setCurrentPage(1);
      })
      .catch(() => {
        setMessage('Error al cargar historial de balances.');
        setMessageVariant('danger');
      });
  };

  const fetchBalancesByUserId = () => {
    if (!searchUserId.trim()) {
      fetchAllBalances();
      return;
    }

    getUserBalances(searchUserId.trim())
      .then(res => {
        setUserBalances(res.data);
        setCurrentPage(1);
      })
      .catch(() => {
        setUserBalances([]);
        setMessage(`No se encontraron registros para el usuario ${searchUserId}`);
        setMessageVariant('danger');
      });
  };

  const getSelectedFund = (): Fund | undefined =>
    funds.find((fund) => fund.id === selectedFundId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    const selectedFund = getSelectedFund();
    const parsedAmount = parseInt(amount, 10);

    if (!userId.trim() || !selectedFundId || isNaN(parsedAmount)) {
      setMessage('Todos los campos son obligatorios y el monto debe ser numérico.');
      setMessageVariant('danger');
      return;
    }

    if (!selectedFund) {
      setMessage('Fondo seleccionado no válido.');
      setMessageVariant('danger');
      return;
    }

    if (parsedAmount < selectedFund.minimumAmount) {
      setMessage(`El monto mínimo para suscribirse al fondo "${selectedFund.name}" es ${selectedFund.minimumAmount} COP.`);
      setMessageVariant('danger');
      return;
    }

    const requestData: UserBalanceRequest = {
      userId: userId.trim(),
      fundId: selectedFundId,
      amount: parsedAmount,
      type: 'APERTURA',
      notificationType,
    };

    try {
      const response = await subscribeToFund(requestData);
      setMessage(response.data.message || 'Suscripción realizada con éxito.');
      setMessageVariant('success');
      setAmount('');
      setSelectedFundId('');
      setUserId('');
      fetchAllBalances(); // Actualiza tabla
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Error al suscribirse al fondo.';
      setMessage(msg);
      setMessageVariant('danger');
    }
  };

  // Paginación lógica
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = userBalances.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(userBalances.length / itemsPerPage);

  const handlePageChange = (page: number) => setCurrentPage(page);

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Suscribirse a un fondo</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>ID de usuario</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese su ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Seleccione un fondo</Form.Label>
          <Form.Select
            value={selectedFundId}
            onChange={(e) => setSelectedFundId(e.target.value)}
          >
            <option value="">-- Seleccione --</option>
            {funds.map((fund) => (
              <option key={fund.id} value={fund.id}>
                {fund.name} (Mínimo: {fund.minimumAmount.toLocaleString()} COP)
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Monto a suscribir (COP)</Form.Label>
          <Form.Control
            type="number"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Tipo de notificación</Form.Label>
          <Form.Select
            value={notificationType}
            onChange={(e) => setNotificationType(e.target.value as NotificationType)}
          >
            <option value="EMAIL">Email</option>
            <option value="SMS">SMS</option>
          </Form.Select>
        </Form.Group>

        <Button type="submit" variant="primary">Suscribirse</Button>
      </Form>

      {message && (
        <Alert variant={messageVariant} className="mt-3">
          {message}
        </Alert>
      )}

      <hr className="my-5" />

      <h3>Historial de balances de usuario</h3>

      <Row className="mb-3">
        <Col md={6}>
          <InputGroup>
            <Form.Control
              placeholder="Buscar por ID de usuario"
              value={searchUserId}
              onChange={(e) => setSearchUserId(e.target.value)}
            />
            <Button onClick={fetchBalancesByUserId} variant="outline-primary">Buscar</Button>
            <Button onClick={fetchAllBalances} variant="outline-secondary">Limpiar filtro</Button>
          </InputGroup>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Fondo</th>
            <th>Monto</th>
            <th>Saldo después</th>
            <th>Tipo</th>
            <th>Notificación</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((ub) => (
            <tr key={ub.id}>
              <td>{ub.id}</td>
              <td>{ub.userId}</td>
              <td>{ub.fundId}</td>
              <td>{ub.amount.toLocaleString('es-CO')}</td>
              <td>{ub.balanceAfter.toLocaleString('es-CO')}</td>
              <td>{ub.type}</td>
              <td>{ub.notificationType}</td>
              <td>{new Date(ub.timestamp).toLocaleString('es-CO')}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {totalPages > 1 && (
        <Pagination>
          {Array.from({ length: totalPages }, (_, index) => (
            <Pagination.Item
              key={index + 1}
              active={currentPage === index + 1}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}
    </Container>
  );
}
