import UserList from './components/UserList';
import MessagingBox from './components/MessagingBox';
import './App.css';

function App() {
  return (
    <div className='main-page'>
      <div className='container'>
        <div className='users-window'>
          <h1>People</h1>
          <UserList />
        </div>
        <div className='message-window'>
          <h1>Person</h1>
          <MessagingBox />
        </div>
      </div>
    </div>
  );
}

export default App;
