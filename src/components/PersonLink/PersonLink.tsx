import React from 'react';
import { Link } from 'react-router-dom';
import { Person } from '../../types';

interface Props {
  person?: Person;
  name: string | null;
}

export const PersonLink: React.FC<Props> = ({ person, name }) => {
  if (!name) {
    return <>-</>;
  }

  if (person) {
    return (
      <Link
        to={`/people/${person.slug}`}
        className={person.sex === 'f' ? 'has-text-danger' : ''}
      >
        {name}
      </Link>
    );
  }

  return <>{name}</>;
};
