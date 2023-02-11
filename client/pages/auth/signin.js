import { useState } from 'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';
import Spinner from '../../components/spinner';

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [doRequest, status] = useRequest({
        method: 'POST',
        url: '/api/users/signin',
        body: { email: email, password: password },
        onSuccess: (data) => { Router.push('/') },
        whileWaiting: () => <Spinner color="orange" />
    });

    return (
        <form onSubmit={doRequest}>
            <h1>Sign In</h1>
            <div className="form-group">
                <label>Email Address</label>
                <input className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {status}
            <button className="btn btn-primary">Sign In</button>
        </form>
    );
}

export default SignUp;