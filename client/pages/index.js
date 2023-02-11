import createRequest from "../api/create-request";

const Home = ({ currentUser }) => {
    return (<div>
        <h1>Landing Page</h1>
        <p>You are signed {currentUser ? 'in' : 'out'}</p>
    </div>
    );
}

export default Home;