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
import { useNavigate, useParams } from 'react-router';

import { peopleClient } from '../../../client';

type Application = "slack";
interface Person {
  id: number;
  name: string;
  birthdate: Date;
  communications: Array<{
    application: Application;
    metadata: Record<string, string> | null;
  }>;
}

const applicationsMetadata: Record<Application, Record<string, { label: string; type: string }>> = {
  slack: {
    channelId: {
      label: 'Channel ID',
      type: 'text',
    },
    userId: {
      label: 'User ID',
      type: 'text',
    },
  },
};

export default function EditPersonComponent() {
  const params = useParams();
  const personId = +(params?.id ?? '0');

  const [person, setPerson] = useState<Person | null>(null);
  const [currentApplication, setCurrentApplication] = useState<Application | null>(null);
  const [currentMetadata, setCurrentMetadata] = useState<Record<string, unknown> | null>(null);
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
        setPerson(response.body as unknown as Person);
        setCurrentApplication(response.body.communications?.[0]?.application as Application ?? null);
        setCurrentMetadata(response.body.communications?.[0]?.metadata ?? null);
      });
  }, [personId]);

  const navigate = useNavigate();
  const updatePersonById = (personId: number, person: Person) => {
    peopleClient
      .updatePersonById({
        params: { id: personId },
        body: {
          name: person.name,
          birthdate: person.birthdate,
          application: currentApplication as Application,
          metadata: currentMetadata as Record<string, string>,
        },
      })
      .then((response) => {
        if (response.status !== 200) {
          return;
        }
        navigate('/');
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


  const renderCommunicationMetadata = (selectedApplication: Application, metadata: Record<string, unknown> | null) => {
    return Object.entries(applicationsMetadata[selectedApplication]).map(([key, value]) => {
      return (
        <Field.Root key={key}>
          <Field.Label>{value.label}</Field.Label>
          <Input
            key={key}
            // FIXME: Metadata[key] is a litteral
            value={metadata?.[key] as string}
            onChange={(e) => {
              setCurrentMetadata({
                ...currentMetadata,
                [key]: e.target.value,
              });
            }}
          />
        </Field.Root>
      );
    });
  };

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
              <NativeSelect.Field name="application" value={currentApplication ?? undefined} onChange={(e) => {
                setCurrentApplication(e.target.value as Application)
              }}>
                <For each={[undefined, 'slack']}>
                  {(item, index) => (
                    <option key={index} value={item}>
                      {item ? firstLetterToUpperCase(item) : 'Aucune application'}
                    </option>
                  )}
                </For>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Field.Root>

          {currentApplication && (
            <Field.Root>
              <Field.Label>{firstLetterToUpperCase(currentApplication)}</Field.Label>
              <Fieldset.Content>
                {renderCommunicationMetadata(currentApplication, currentMetadata)}
            </Fieldset.Content>
          </Field.Root>
          )}

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

function firstLetterToUpperCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}