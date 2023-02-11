import Link from 'next/link';

export default ({ currentUser }) => {
  const links = [
    !currentUser && { label: 'Sign In', href: '/auth/signin' },
    !currentUser && { label: 'Sign Up', href: '/auth/signup' },
    currentUser && { label: 'Sign Out', href: '/auth/signout' },
  ].filter(e => e).map((e, i) => <li className='px-1' key={i}><Link href={e.href}>{e.label}</Link></li>);

  return (
    <nav className='navbar navbar-light bg-light'>
      <Link href='/'>
        GitTix
      </Link>

      <div className='d-flex justify-content-end'>
        <ul className='nav d-flex align-items-center'>
          {links}
        </ul>
      </div>
    </nav>
  );
};
