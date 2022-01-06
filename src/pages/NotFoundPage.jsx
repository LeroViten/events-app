import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div>
      <h1>
        The page isn't found, go to <Link to={'/'}>Main page</Link>
      </h1>
    </div>
  );
}
