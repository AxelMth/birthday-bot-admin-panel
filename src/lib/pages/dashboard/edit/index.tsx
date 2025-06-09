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

interface Person {
  id: number;
  name: string;
  birthdate: Date;
  communications: Array<{
    application: string;
    metadata: Record<string, string> | null;
  }>;
}

const applicationsMetadata = {
  slack: {
    channelId: {
      label: 'Channel ID',
      type: 'text',
    },
  },
};

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
        setPerson(response.body as unknown as Person);
      });
  }, [personId]);

  const navigate = useNavigate();
  const updatePersonById = (personId: number, person: Person) => {
    peopleClient
      .updatePersonById({
        params: { id: personId },
        body: {
          ...person,
          application: person.communications[0].application,
          metadata: person.communications[0].metadata ?? undefined,
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


  const renderCommunicationMetadata = (communication: {
    application: string;
    metadata: Record<string, string> | null;
  }, selectedApplication: string) => {
    if (!communication.metadata) {
      return null;
    }
    const applicationMetadata = applicationsMetadata[selectedApplication as keyof typeof applicationsMetadata];
    if (!applicationMetadata) {
      return null;
    }
    return Object.entries(applicationMetadata).map(([key, value]) => {
      return (
        <Field.Root key={key}>
          <Field.Label>{value.label}</Field.Label>
          <Input
            key={key}
            value={communication?.metadata?.[key]}
            onChange={(e) => {
              setPerson({
                ...person,
                communications: person.communications.map((c) =>
                  c.application === selectedApplication
                    ? { ...c, metadata: { ...c.metadata, [key]: e.target.value } }
                    : c,
                ),
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
              <NativeSelect.Field name="application" value={person.communications[0].application} onChange={(e) => {
                setPerson({
                  ...person,
                  communications: person.communications.map((c) => c.application === e.target.value ? { ...c, application: e.target.value } : c),
                });
              }}>
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

          <Field.Root>
            <Fieldset.Content>
              {person.communications.map((c) => (
                <Field.Root key={c.application}>
                  <Field.Label>{c.application}</Field.Label>
                  {renderCommunicationMetadata(c, c.application)}
                </Field.Root>
              ))}
            </Fieldset.Content>
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
