import React, { useEffect, useState } from 'react';
import {
  getFunds,
  createFund,
  updateFund,
  deleteFund
} from '../api/fundApi';
import { Fund } from '../types';
import {
  Table,
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert
} from 'react-bootstrap';

export default function FundsPage() {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [formData, setFormData] = useState<Omit<Fund, 'id'> & { id?: string }>({
    name: '',
    minimumAmount: 0,
    category: 'FIC',
    id: undefined
  });
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState<'success' | 'danger'>('success');
  const [filterId, setFilterId] = useState('');

  const fetchFunds = async () => {
    try {
      const response = await getFunds();
      setFunds(response.data);
    } catch (error) {
      setMessage('Error al cargar los fondos.');
      setVariant('danger');
    }
  };

  useEffect(() => {
    fetchFunds();
  }, []);

  const handleChange = (e: React.ChangeEvent<any>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await updateFund(formData.id, formData);
        setMessage('Fondo actualizado correctamente.');
      } else {
        await createFund(formData);
        setMessage('Fondo creado correctamente.');
      }
      setVariant('success');
      setFormData({ name: '', minimumAmount: 0, category: 'FIC', id: undefined });
      fetchFunds();
    } catch (error) {
      setMessage('Error al guardar el fondo.');
      setVariant('danger');
    }
  };

  const handleEdit = (fund: Fund) => {
    setFormData(fund);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteFund(id);
      setMessage('Fondo eliminado correctamente.');
      setVariant('success');
      fetchFunds();
    } catch (error) {
      setMessage('Error al eliminar el fondo.');
      setVariant('danger');
    }
  };

  const filteredFunds = funds.filter((fund) =>
    fund.id.includes(filterId)
  );

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Gestión de Fondos</h2>

      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group controlId="formName">
              <Form.Label>Nombre del fondo</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej: FDO-ACCIONES"
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formAmount">
              <Form.Label>Monto mínimo</Form.Label>
              <Form.Control
                type="number"
                name="minimumAmount"
                value={formData.minimumAmount}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formCategory">
              <Form.Label>Categoría</Form.Label>
              <Form.Select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="FIC">FIC</option>
                <option value="FPV">FPV</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Button type="submit" variant="primary">
          {formData.id ? 'Actualizar Fondo' : 'Crear Fondo'}
        </Button>
      </Form>

      {message && (
        <Alert className="mt-3" variant={variant}>
          {message}
        </Alert>
      )}

      <hr />

      <Form.Group as={Row} className="mb-3" controlId="filterId">
        <Form.Label column sm="2">Filtrar por ID</Form.Label>
        <Col sm="6">
          <Form.Control
            type="text"
            value={filterId}
            onChange={(e) => setFilterId(e.target.value)}
            placeholder="Ingrese ID del fondo"
          />
        </Col>
        <Col sm="4">
          <Button variant="secondary" onClick={() => setFilterId('')}>Limpiar filtro</Button>
        </Col>
      </Form.Group>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Monto mínimo</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredFunds.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center">No hay fondos disponibles.</td>
            </tr>
          ) : (
            filteredFunds.map((fund) => (
              <tr key={fund.id}>
                <td>{fund.id}</td>
                <td>{fund.name}</td>
                <td>{fund.minimumAmount.toLocaleString()}</td>
                <td>{fund.category}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleEdit(fund)}
                    className="me-2"
                  >
                    ✏️
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(fund.id)}
                  >
                    🗑️
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
}
