import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { PeopleFilters } from '../components/PeopleFilters/PeopleFilters';
import { PeopleTable } from '../components/PeopleTable/PeopleTable';
import { getPeople } from '../api';
import { Loader } from '../components/Loader';
import { Person } from '../types';

export const PeoplePage = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { slug } = useParams<{ slug?: string }>();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    getPeople()
      .then(fetchedPeople => {
        // Додаємо зв'язки батьків
        const peopleMap: Record<string, Person> = Object.fromEntries(
          fetchedPeople.map(p => [p.name, p]),
        );

        const peopleWithParents = fetchedPeople.map(p => ({
          ...p,
          mother: p.motherName ? peopleMap[p.motherName] : undefined,
          father: p.fatherName ? peopleMap[p.fatherName] : undefined,
        }));

        setPeople(peopleWithParents);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const query = searchParams.get('query')?.toLowerCase() || '';
  const sex = searchParams.get('sex') || '';
  const centuries = searchParams.getAll('centuries');

  const visiblePeople = people.filter(person => {
    const matchesQuery = person.name.toLowerCase().includes(query);
    const matchesSex = sex === '' || person.sex === sex;
    const birthCentury = Math.ceil(person.died / 100);
    const matchesCentury =
      centuries.length === 0 || centuries.includes(birthCentury.toString());

    return matchesQuery && matchesSex && matchesCentury;
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
              {error && (
                <p data-cy="peopleLoadingError" className="has-text-danger">
                  Something went wrong
                </p>
              )}
              {!loading && !error && visiblePeople.length === 0 && (
                <p>No people found</p>
              )}
              {!loading && !error && visiblePeople.length > 0 && (
                <PeopleTable people={visiblePeople} highlightedSlug={slug} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
