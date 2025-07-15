import React, { useEffect, useState } from 'react';
import {
  getTransactionAll,
  getTransactionHistory
} from '../api/fundApi';
import { Transaction } from '../types';
import {
  Container,
  Table,
  Alert,
  InputGroup,
  Form,
  Button,
  Row,
  Col,
  Pagination
} from 'react-bootstrap';

export default function HistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchUserId, setSearchUserId] = useState('');
  const [message, setMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchAllTransactions();
  }, []);

  const fetchAllTransactions = async () => {
    try {
      const res = await getTransactionAll();
      const sorted = res.data.sort((a: Transaction, b: Transaction) => b.timestamp - a.timestamp);
      setTransactions(sorted);
      setMessage('');
      setCurrentPage(1);
    } catch (err) {
      setMessage('Error al cargar el historial completo de transacciones.');
    }
  };

  const fetchTransactionsByUserId = async () => {
    if (!searchUserId.trim()) {
      fetchAllTransactions();
      return;
    }

    try {
      const res = await getTransactionHistory(searchUserId.trim());
      const sorted = res.data.sort((a: Transaction, b: Transaction) => b.timestamp - a.timestamp);
      setTransactions(sorted);
      setMessage('');
      setCurrentPage(1);
    } catch (err) {
      setTransactions([]);
      setMessage(`No se encontraron transacciones para el usuario ${searchUserId}`);
    }
  };

  const formatCOP = (amount: number): string =>
    amount.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    });

  const formatDate = (timestamp: number): string =>
    new Date(timestamp).toLocaleString('es-CO');

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = transactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  const handlePageChange = (page: number) => setCurrentPage(page);

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Historial de Transacciones</h2>

      <Row className="mb-3">
        <Col md={6}>
          <InputGroup>
            <Form.Control
              placeholder="Buscar por ID de usuario"
              value={searchUserId}
              onChange={(e) => setSearchUserId(e.target.value)}
            />
            <Button variant="outline-primary" onClick={fetchTransactionsByUserId}>
              Buscar
            </Button>
            <Button variant="outline-secondary" onClick={fetchAllTransactions}>
              Limpiar filtro
            </Button>
          </InputGroup>
        </Col>
      </Row>

      {message && <Alert variant="danger">{message}</Alert>}

      {!message && currentItems.length === 0 && (
        <Alert variant="info">No hay transacciones registradas.</Alert>
      )}

      {currentItems.length > 0 && (
        <>
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
              {currentItems.map((tx) => (
                <tr key={tx.id}>
                  <td>{tx.id}</td>
                  <td>{tx.userId}</td>
                  <td>{tx.fundId}</td>
                  <td>{formatCOP(tx.amount)}</td>
                  <td>{formatCOP(tx.balanceAfter)}</td>
                  <td>{tx.type}</td>
                  <td>{tx.notificationType}</td>
                  <td>{formatDate(tx.timestamp)}</td>
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
        </>
      )}
    </Container>
  );
}
