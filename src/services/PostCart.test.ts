import { surroundWithTag, surroundWithTags } from './PostCart';

/**
 * Test de surroundWithTag
 */

test("Entourer d'un tag avec valeur null et le tag B doit retourner [b][/b]", () => {
  expect(surroundWithTag(null, 'b')).toBe('[b][/b]');
});

test("Entourer d'un tag avec valeur vide et le tag B doit retourner [b][/b]", () => {
  expect(surroundWithTag('', 'b')).toBe('[b][/b]');
});

test("Entourer d'un tag la valeur 'test' et le tag B doit retourner [b]test[/b]", () => {
  expect(surroundWithTag('test', 'b')).toBe('[b]test[/b]');
});

test('Entourer du tag url avec la valeur nulle le mot google doit retourner google', () => {
  expect(surroundWithTag('google', { name: 'url', value: null })).toBe(
    'google'
  );
});

test('Entourer du tag url avec la valeur vide le mot google doit retourner google', () => {
  expect(surroundWithTag('google', { name: 'url', value: '' })).toBe('google');
});

test('Entourer du tag url avec la valeur http://www.google.fr le mot google doit retourner [url=http://www.google.fr]google[/url]', () => {
  expect(
    surroundWithTag('google', { name: 'url', value: 'http://www.google.fr' })
  ).toBe('[url=http://www.google.fr]google[/url]');
});

/**
 * Test de surroundWithTags
 */

test('Entourer des tags url et B avec la valeur vide le mot google doit retourner [b]google[/b]', () => {
  expect(surroundWithTags('google', [{ name: 'url', value: '' }, 'b'])).toBe(
    '[b]google[/b]'
  );
});

test('Entourer des tags url et B avec la valeur http://www.google.fr le mot google doit retourner [b][url=http://www.google.fr]google[/url][/b]', () => {
  expect(
    surroundWithTags('google', [
      { name: 'url', value: 'http://www.google.fr' },
      'b'
    ])
  ).toBe('[b][url=http://www.google.fr]google[/url][/b]');
});
