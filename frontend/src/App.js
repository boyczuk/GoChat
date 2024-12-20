import UserList from './components/UserList';
import MessagingBox from './components/MessagingBox';
import './App.css';
import UserProfileCard from './components/UserProfileCard';

function App() {
  return (
    <div className='main-page'>
      <div className='container'>
        <div className='users-window'>
          <UserProfileCard />
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
