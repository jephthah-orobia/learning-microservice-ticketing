import 'bootstrap/dist/css/bootstrap.min.css';
import createRequest from '../api/create-request';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
    return (<div>
        <Header currentUser={currentUser} />
        <Component {...pageProps} currentUser={currentUser} />
    </div>
    )
}

AppComponent.getInitialProps = async ({ Component, ctx }) => {
    const request = createRequest(ctx.req, 'GET', '/api/users/currentuser');
    const response = await fetch(request)
        .then(res => res.json())
        .catch(e => { currentUser: null });
    const pageProps = (Component.getInitialProps) ? await Component.getInitialProps(ctx) : {};
    return { pageProps, ...response };
}

export default AppComponent;