import { Link } from 'react-router-dom';
import { Container, Button, ButtonGroup } from 'react-bootstrap';

export default function HomePage() {
  return (
    <Container className="text-center mt-5">
      <h1 className="mb-4">¡Bienvenido a la Plataforma de Fondos!</h1>
      <div className="d-flex justify-content-center">
        <ButtonGroup>
          <Link to="/subscribe">
            <Button variant="primary" className="mx-1">Ir a Suscripción</Button>
          </Link>
          <Link to="/cancel">
            <Button variant="primary" className="mx-1">Ir a Cancelar Suscripción</Button>
          </Link>
          <Link to="/history">
            <Button variant="primary" className="mx-1">Ver historial de transacciones</Button>
          </Link>
          <Link to="/funds">
            <Button variant="primary" className="mx-1">Ir a Fondos</Button>
          </Link>
        </ButtonGroup>
      </div>
    </Container>
  );
}
