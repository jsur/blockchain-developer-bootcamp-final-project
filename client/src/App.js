import React from 'react';
import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Home from './pages/Home';
import Details from './pages/Details';
import Rented from './pages/Rented';
import Header from './components/Header';
import { AppContextProvider } from './AppContext';
import './styles/App.css';

function getLibrary(provider) {
  return new ethers.providers.Web3Provider(provider);
}

const App = () => {
  if (window.ethereum) {
    window.ethereum.on('networkChanged', () => window.location.reload());
  }

  return (
    <AppContextProvider>
      <Web3ReactProvider getLibrary={getLibrary}>
        <>
          <Header />
          <Container className="mt-5 d-flex flex-column justify-content-center align-items-center">
            <Route exact path="/" component={Home} />
            <Route exact path="/details" component={Details} />
            <Route exact path="/rented" component={Rented} />
          </Container>
        </>
      </Web3ReactProvider>
    </AppContextProvider>
  );
};

export default App;
