import { h } from 'astro';
import A from '../components/A.tsx';
import Counter from '../components/Counter.tsx';

export default function Astro({ children, ...props }) {
  console.log(props);
  return (
    <div class="page">
      <span>Hello page!</span>
      <A />
      <Counter />
    </div>
  );
}
