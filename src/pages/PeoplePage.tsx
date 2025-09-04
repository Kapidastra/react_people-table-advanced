import { PeopleFilters } from '../components/PeopleFilters/PeopleFilters';
import { getPeople } from '../api';
import { Loader } from '../components/Loader';
import { PeopleTable } from '../components/PeopleTable/PeopleTable';
import { useState, useEffect } from 'react';
import { Person } from '../types';
import { useParams, useSearchParams } from 'react-router-dom';

export const PeoplePage = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { slug } = useParams<{ slug?: string }>();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    getPeople()
      .then(setPeople)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const query = searchParams.get('query')?.toLowerCase() || '';
  const centuries = searchParams.getAll('centuries');

  const visiblePeople = people.filter(person => {
    const matchesQuery = person.name.toLowerCase().includes(query);

    const birthCentury = Math.ceil(person.died / 100);
    const matchesCentury =
      centuries.length === 0 || centuries.includes(birthCentury.toString());

    return matchesQuery && matchesCentury;
  });

  return (
    <>
      <h1 className="title">People Page</h1>

      <div className="block">
        <div className="columns is-desktop is-flex-direction-row-reverse">
          <div className="column is-7-tablet is-narrow-desktop">
            <PeopleFilters />
          </div>

          <div className="column">
            <div className="box table-container">
              {loading && <Loader />}
              {error && <p className="has-text-danger">Something went wrong</p>}
              {!loading && !error && (
                <PeopleTable people={visiblePeople} highlightedSlug={slug} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};