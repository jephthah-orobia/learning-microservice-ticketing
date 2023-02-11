import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Spinner from '../../components/spinner';
import useRequest from '../../hooks/use-request';

const SignOut = () => {
    const router = useRouter();
    const [doRequest, errors] = useRequest({
        method: 'POST',
        url: '/api/users/signout',
        onSuccess: () => router.push('/')
    });

    useEffect(() => doRequest(), []);

    return <div>
        <p>Signing you out...</p>
        <Spinner />
    </div>
}

export default SignOut;