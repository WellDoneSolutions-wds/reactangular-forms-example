import { useEffect, useReducer, useRef } from "react";
import { IExecutor, IRxExecuteFn, RxExecutor } from "./Execution";

export const useAsyncExecutor2 = <P extends any, D extends any>(
  executeFn$: IRxExecuteFn<P, D>,
  config?: IExecutor<P, D>
) => {
  const asyncExecutorRef = useRef(RxExecutor.create(executeFn$, config));
  const asyncExecutor = asyncExecutorRef.current;

  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    const subscription = asyncExecutor.state$.subscribe((x) => {
      forceUpdate();
    });
    return () => {
      asyncExecutor.close();
      subscription.unsubscribe();
    };
  }, [asyncExecutor]);

  return asyncExecutor;
};
