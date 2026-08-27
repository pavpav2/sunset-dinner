import { Reveal } from './Reveal';

export function DrinksSection() {
  return (
    <section className="s-drinks">
      <Reveal className="inner">
        <p className="meta" style={{ marginBottom: '1rem' }}>
          Nápoje
        </p>
        <h2>
          Ke každému chodu
          <br />
          padnoucí drink
        </h2>
        <p className="lead">
          Welcome drink na přivítanou a párování k celému menu — pokaždé v alko i nealko verzi.
          Pivo, víno, koktejly. A když slunce sedne za obzor: tequila sunset.
        </p>
      </Reveal>
    </section>
  );
}
