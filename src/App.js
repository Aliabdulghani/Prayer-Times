import './App.css';
import MainContent from './components/MainContent';
import Container from '@mui/material/Container';

function App() {
  return (
    <>
      <div
        style={{
          margin: '200px auto',
          display: 'flex',
          justifyContent: 'center',
          width: '100w',
          textAlign: 'center',
        }}>
        <Container maxWidth="xl">
          <MainContent />
        </Container>
      </div>
    </>
  );
}

export default App;
