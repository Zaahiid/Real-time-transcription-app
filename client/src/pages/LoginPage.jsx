import { Button, Card, Form, InputOTP, Label, REGEXP_ONLY_DIGITS, Spinner } from '@heroui/react';
import { useState } from 'react';

import { useAuth } from '../auth/AuthProvider.jsx';
import LogoMark from '../components/LogoMark.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';

const CODE_LENGTH = 6;

const digitsOnly = (text) => text.replace(/\D/g, '');

export default function LoginPage() {
  const { signIn } = useAuth();
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(false);

  async function submit(value) {
    if (pending) return;

    setPending(true);
    try {
      await signIn(value);
    } catch (err) {
      setError(err.message);
      setCode('');
      setPending(false);
    }
  }

  function handleChange(value) {
    setCode(value);
    setError(null);
  }

  function handleSubmit(event) {
    event.preventDefault();
    submit(code);
  }

  return (
    <main className="relative grid min-h-dvh place-items-center overflow-x-clip px-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-sm p-2 motion-safe:animate-fade-up">
        <Card.Header className="items-center gap-3 text-center">
          <LogoMark className="size-14 rounded-2xl motion-safe:animate-breathe" />
          <Card.Title className="text-xl">Speech to Text</Card.Title>
          <Card.Description>This demo is private. Enter the 6-digit access code to continue.</Card.Description>
        </Card.Header>

        <Card.Content>
          <Form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col items-center gap-2 text-center">
              <Label id="access-code-label">Access code</Label>
              <InputOTP
                name="code"
                maxLength={CODE_LENGTH}
                pattern={REGEXP_ONLY_DIGITS}
                pasteTransformer={digitsOnly}
                value={code}
                onChange={handleChange}
                onComplete={submit}
                isInvalid={Boolean(error)}
                variant="secondary"
                className="justify-center"
                aria-labelledby="access-code-label"
                aria-describedby="access-code-error"
                autoFocus
              >
                <InputOTP.Group>
                  <InputOTP.Slot index={0} />
                  <InputOTP.Slot index={1} />
                  <InputOTP.Slot index={2} />
                </InputOTP.Group>
                <InputOTP.Separator />
                <InputOTP.Group>
                  <InputOTP.Slot index={3} />
                  <InputOTP.Slot index={4} />
                  <InputOTP.Slot index={5} />
                </InputOTP.Group>
              </InputOTP>
              <span id="access-code-error" className="field-error" data-visible={Boolean(error)} role="alert">
                {error}
              </span>
            </div>

            <Button type="submit" fullWidth isPending={pending} isDisabled={code.length < CODE_LENGTH}>
              {pending && <Spinner color="current" size="sm" />}
              Continue
            </Button>
          </Form>
        </Card.Content>
      </Card>
    </main>
  );
}
