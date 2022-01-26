import { getValue, Model, when } from '@whenjs/when';
import { useEffect, useState } from 'react';
import { Observable } from 'rxjs';

export type PropSelector<TIn, TOut> = ((t: TIn) => TOut);

export function useObservable<T>(
  target: () => Observable<T>,
  initial?: T,
): T | undefined {
  const [ret, setter] = useState(initial);
  const [obs] = useState(target);

  useEffect(
    () => {
      const sub = obs.subscribe(setter);
      return sub.unsubscribe.bind(sub);
    },
    [obs],
  );

  return ret;
}

export function useViewModel<T extends Model>(initial: () => T) {
  const [ret] = useState(initial);

  useEffect(
    () => {
      return ret.unsubscribe.bind(ret);
    },
    [ret],
  );

  return ret;
}

export function useWhen<TSource, TRet>(
  model: TSource,
  prop: PropSelector<TSource, TRet>,
): TRet | undefined {
  const initial = getValue(model, prop);
  const val = initial ? initial.value! : undefined;

  return useObservable(() => when(model, prop), val);
}
