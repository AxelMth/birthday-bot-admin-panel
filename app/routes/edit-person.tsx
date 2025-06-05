import { useNavigate, useParams } from 'react-router';
import {
  Button,
  Container,
  Field,
  Fieldset,
  For,
  Input,
  Loader,
  NativeSelect,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { peopleClient } from '../lib/client';

interface Person {
  id: number;
  name: string;
  birthdate: Date;
  communications: { application: string }[];
}

export default function EditPersonComponent() {
  const params = useParams();
  const personId = +(params?.id ?? '0');

  const [person, setPerson] = useState<Person | null>(null);
  useEffect(() => {
    if (!personId || !+personId) {
      return;
    }
    peopleClient
      .getPersonById({
        params: { id: +personId },
      })
      .then((response) => {
        if (response.status !== 200) {
          return;
        }
        setPerson(response.body);
      });
  }, [personId]);

  const navigate = useNavigate();
  const updatePersonById = (personId: number, person: Person) => {
    peopleClient
      .updatePersonById({
        params: { id: personId },
        body: person,
      })
      .then((response) => {
        if (response.status !== 200) {
          return;
        }
        navigate(`/`);
      });
  };

  if (!personId) {
    return (
      <Container>
        <p>Identifiant invalide</p>
      </Container>
    );
  }

  if (!person) {
    return (
      <Container fluid centerContent>
        <Loader />
      </Container>
    );
  }

  return (
    <Container fluid centerContent>
      <h1>Modifier un anniversaire</h1>
      <Fieldset.Root size="lg" maxW="md">
        <Fieldset.Content>
          <Field.Root>
            <Field.Label>Nom</Field.Label>
            <Input
              name="name"
              value={person.name}
              onChange={(e) =>
                setPerson({
                  ...person,
                  name: e.target.value,
                })
              }
            />
          </Field.Root>

          <Field.Root>
            <Field.Label>Date de naissance</Field.Label>
            <Input
              name="date"
              type="date"
              value={`${person.birthdate.toISOString().split('T')[0]}`}
              onChange={(e) => {
                const date = new Date(e.target.value);
                setPerson({
                  ...person,
                  birthdate: date,
                });
              }}
            />
          </Field.Root>

          <Field.Root>
            <Field.Label>Application</Field.Label>
            <NativeSelect.Root>
              <NativeSelect.Field name="application">
                <For each={['slack']}>
                  {(item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  )}
                </For>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Field.Root>
        </Fieldset.Content>

        <Button
          type="submit"
          alignSelf="flex-start"
          onClick={() => updatePersonById(person.id, person)}
        >
          Modifier
        </Button>
      </Fieldset.Root>
    </Container>
  );
}
