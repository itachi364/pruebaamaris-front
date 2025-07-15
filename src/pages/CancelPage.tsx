import React, { useEffect, useState } from 'react';
import {
  cancelFund,
  getFunds,
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

export default function CancelPage() {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [userId, setUserId] = useState('');
  const [searchUserId, setSearchUserId] = useState('');
  const [selectedFundId, setSelectedFundId] = useState('');
  const [notificationType, setNotificationType] = useState<NotificationType>('EMAIL');
  const [message, setMessage] = useState('');
  const [messageVariant, setMessageVariant] = useState<'success' | 'danger'>('success');
  const [userBalances, setUserBalances] = useState<UserBalance[]>([]);

  // Paginación
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getFunds()
      .then((response) => setFunds(response.data))
      .catch(() => {
        setMessage('Error al cargar los fondos.');
        setMessageVariant('danger');
      });

    fetchAllBalances();
  }, []);

  const fetchAllBalances = () => {
    getUserBalancesAll()
      .then((res) => {
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
      .then((res) => {
        setUserBalances(res.data);
        setCurrentPage(1);
      })
      .catch(() => {
        setUserBalances([]);
        setMessage(`No se encontraron registros para el usuario ${searchUserId}`);
        setMessageVariant('danger');
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (!userId.trim() || !selectedFundId) {
      setMessage('Debe ingresar su ID de usuario y seleccionar un fondo.');
      setMessageVariant('danger');
      return;
    }

    const requestData: UserBalanceRequest = {
      userId: userId.trim(),
      fundId: selectedFundId,
      amount: 1,
      type: 'CANCELACION',
      notificationType,
    };

    try {
      const response = await cancelFund(requestData);
      setMessage(response.data.message || 'Cancelación exitosa.');
      setMessageVariant('success');
      setSelectedFundId('');
      setUserId('');
      fetchAllBalances();
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Error al cancelar el fondo.';
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
      <h2 className="mb-4">Cancelar suscripción a un fondo</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formUserId">
          <Form.Label>ID de usuario</Form.Label>
          <Form.Control
            type="text"
            value={userId}
            placeholder="Ingrese su ID"
            onChange={(e) => setUserId(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formFund">
          <Form.Label>Seleccione el fondo a cancelar</Form.Label>
          <Form.Select
            value={selectedFundId}
            onChange={(e) => setSelectedFundId(e.target.value)}
          >
            <option value="">-- Seleccione --</option>
            {funds.map((fund) => (
              <option key={fund.id} value={fund.id}>
                {fund.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formNotification">
          <Form.Label>Tipo de notificación</Form.Label>
          <Form.Select
            value={notificationType}
            onChange={(e) => setNotificationType(e.target.value as NotificationType)}
          >
            <option value="EMAIL">Email</option>
            <option value="SMS">SMS</option>
          </Form.Select>
        </Form.Group>

        <Button variant="danger" type="submit">
          Cancelar suscripción
        </Button>
      </Form>

      {message && (
        <Alert className="mt-3" variant={messageVariant}>
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