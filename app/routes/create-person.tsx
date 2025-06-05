import { useNavigate } from 'react-router';
import {
  Button,
  Container,
  Field,
  Fieldset,
  For,
  Input,
  NativeSelect,
} from '@chakra-ui/react';
import { useState } from 'react';

import { peopleClient } from '../lib/client';

interface Person {
  id: number;
  name: string;
  birthdate: Date;
  communications: { application: string }[];
}

export default function CreatePersonComponent() {
  const [person, setPerson] = useState<Person>({
    id: 0,
    name: '',
    birthdate: new Date(),
    communications: [{ application: 'slack' }],
  });

  const navigate = useNavigate();
  const createPersonById = (personId: number, person: Person) => {
    peopleClient
      .createPerson({
        body: person,
      })
      .then((response) => {
        if (response.status !== 200) {
          return;
        }
        navigate(`/`);
      });
  };

  return (
    <Container fluid centerContent>
      <h1>Créer un anniversaire</h1>
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
          onClick={() => createPersonById(person.id, person)}
        >
          Modifier
        </Button>
      </Fieldset.Root>
    </Container>
  );
}
