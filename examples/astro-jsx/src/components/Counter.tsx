import { h } from 'astro';
import A from './A.tsx';
import PreactCounter from './PreactCounter.tsx';

export default function Test({ children }) {
  return (
    <div class="counter">
      <span>Hello world!</span>
      <A />
      <PreactCounter client:load client:component-path={new URL('./PreactCounter.tsx', import.meta.url).pathname}  client:component-export="default" />
    </div>
  );
}
