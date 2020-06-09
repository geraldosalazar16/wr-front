import React from 'react'
import './App.css'
import { BrowserRouter} from 'react-router-dom'
import Loading from './components/Loading'
import 'react-toastify/dist/ReactToastify.css';
import Toast from './components/Toast';
import Container from './components/Container'

export default function App() {
  return (
    <div>
      <Loading />
      <BrowserRouter>
        <Toast />
        <Container />
      </BrowserRouter>
    </div>
  );
}