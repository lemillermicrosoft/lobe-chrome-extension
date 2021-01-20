import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { isEqual, each, throttle, noop, DebouncedFunc } from "lodash";
// import {
//   FlexVirtualizable,
//   FlexBoundary,
// } from '@lobe/shared/dist/types/flexDataset';
// import {
//   isVisibleInViewports,
//   dictKeysChanged,
//   createVisibilityDict,
// } from './flex/flexVirtualize';

type DebounceType = DebouncedFunc<() => void>;

// use a toggleable menu
export function useToggleMenu(
  defaultState = false
): [boolean, () => void, () => void] {
  const [menuVisible, setMenuVisible] = useState(defaultState);

  const toggleMenu = useCallback(() => {
    setMenuVisible(!menuVisible);
  }, [menuVisible, setMenuVisible]);

  const hideMenu = useCallback(() => {
    setMenuVisible(false);
  }, [setMenuVisible]);

  return [menuVisible, toggleMenu, hideMenu];
}

export function useThrottle(
  func: Function,
  delay = 1000
): React.MutableRefObject<Function> {
  const funcRef = useRef<Function>(func);
  const throttled = useRef<DebounceType>();

  // set up throttle
  useEffect(() => {
    throttled.current = throttle(() => funcRef.current(), delay);
  }, [delay]);

  // cancel throttle on unmount
  useEffect(() => {
    return () => throttled.current && throttled.current.cancel();
  }, []);

  return throttled;
}

export function useMountedPropChanged<T>(prop: T): boolean {
  const prevProp = usePreviousMountedProp(prop);
  return !isEqual(prevProp, prop);
}

export function usePreviousMountedProp<T>(prop: T) {
  const propRef = useRef<T>(undefined);
  useEffect(() => {
    propRef.current = prop;
  }, [prop]);
  return propRef.current;
}

export function usePropChanged<T>(prop: T): boolean {
  const prevProp = usePreviousProp(prop);
  return !isEqual(prevProp, prop);
}

export function usePreviousProp<T>(prop: T): T {
  const propRef = useRef<T>(prop);
  useEffect(() => {
    propRef.current = prop;
  }, [prop]);
  return propRef.current;
}

// export function useImageSize(url: string, knownSize?: AGSize): AGSize {
//   const [imageSize, setImageSize] = useState<AGSize>(knownSize);
//   const loading = useRef<HTMLImageElement>(null);
//   useEffect(() => {
//     if (!knownSize) {
//       loading.current = new Image();
//       loading.current.src = url;
//       loading.current.onload = () => {
//         const {width, height} = loading.current;
//         setImageSize({
//           width,
//           height,
//         });
//       };
//       return () => (loading.current.onload = null);
//     }
//   }, [url, setImageSize, knownSize]);

//   return imageSize;
// }

export function useElementRect(): [
  React.RefObject<HTMLDivElement>,
  ClientRect?
] {
  const ref = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<ClientRect>(null);

  useEffect(() => {
    setRect(ref.current ? ref.current.getBoundingClientRect() : null);
  }, [ref, setRect]);

  return [ref, rect];
}

// how long to maintain "intermediate frames" for virtualized elements
// after animation
const CLEANUP_TIMEOUT = 2000;

// export function useVirtualized<T extends FlexVirtualizable>(
//   items: T[],
//   viewport: FlexBoundary,
//   overscan = 500,
// ): Record<number, T> {
//   const [visibleItems, setVisibleItems] = useState<Record<number, T>>({});
//   const itemsChanged = usePropChanged(items);
//   const prevViewport = usePreviousProp<FlexBoundary>(viewport);
//   const initialized = useRef(false);
//   const timer = useRef(null);

//   // cleanup after moving viewports. go through visible items and if they
//   // shouldn't be visible (because an animation has ended), remove them
//   const cleanup = useCallback(
//     (nextVisible: Record<number, T>, _viewport: FlexBoundary) => {
//       const visible: Record<number, T> = {};
//       each(nextVisible, (item, k) => {
//         if (isVisibleInViewports(item.location, [_viewport])) {
//           visible[k] = item;
//         }
//       });
//       if (dictKeysChanged(visible, nextVisible)) {
//         setVisibleItems(visible);
//       }
//     },
//     [setVisibleItems],
//   );

//   // clear timeout on unmount
//   useLayoutEffect(() => {
//     return () => {
//       clearTimeout(timer.current);
//       timer.current = null;
//     };
//   }, []);

//   // when viewports or items change, figure out what's on screen and what's
//   // "partially" on-screen: i.e. intermediate items during animation
//   useLayoutEffect(() => {
//     const viewportChanged = prevViewport.leading !== viewport.leading;
//     if (viewportChanged || itemsChanged || !initialized.current) {
//       const nextVisibleItems = createVisibilityDict<T>(
//         items,
//         viewport,
//         prevViewport,
//         overscan,
//       );

//       // update state only if the visible items changed or the layout changes
//       const keysChanged = dictKeysChanged(nextVisibleItems, visibleItems);
//       if (itemsChanged || keysChanged) {
//         setVisibleItems(nextVisibleItems);
//         initialized.current = true;
//       }

//       // trigger a cleanup pass to clear intermediate items
//       clearTimeout(timer.current);
//       timer.current = null;
//       timer.current = setTimeout(() => {
//         cleanup(nextVisibleItems, viewport);
//       }, CLEANUP_TIMEOUT);
//     }
//   }, [
//     items,
//     itemsChanged,
//     viewport,
//     setVisibleItems,
//     visibleItems,
//     overscan,
//     prevViewport,
//     cleanup,
//   ]);

//   return visibleItems;
// }

export function useDocumentListener(
  event: string,
  func: EventListenerOrEventListenerObject
) {
  useEffect(() => {
    document.addEventListener(event, func);
    return () => document.removeEventListener(event, func);
  }, [event, func]);
}

export function useWindowListener(
  event: string,
  func: EventListenerOrEventListenerObject
) {
  useEffect(() => {
    window.addEventListener(event, func);
    return () => {
      window.removeEventListener(event, func);
    };
  }, [event, func]);
}

// export function useQueryErrorCallback(
//   query: QueryResult,
//   callback: (error: ApolloError) => void,
// ) {
//   useEffect(() => {
//     if (query && query.error) {
//       callback(query.error);
//     }
//   }, [query, callback]);
// }

export function useLocalStorage(
  key: string
): [string, (newVal: string) => void] {
  const storedValue = window.localStorage.getItem(key);
  const [value, setStateValue] = useState(storedValue);

  if (storedValue !== value) {
    setStateValue(storedValue);
  }

  const setValue = useCallback(
    (newVal: string) => {
      if (newVal) {
        window.localStorage.setItem(key, newVal);
      } else {
        window.localStorage.removeItem(key);
      }
      setStateValue(newVal);
    },
    [key, setStateValue]
  );

  return [value, setValue];
}

/**
 * Fetches data from a URL with given (optional) options.
 * Takes *care of its own cleanup. Some work may still be required to get rid of abort()
 */
export function useFetch<T>(url?: string, options?: RequestInit) {
  interface FetchState {
    loading: boolean;
    error: any;
    response: T;
    abort: () => void;
  }

  const [state, setState] = useState<FetchState>({
    loading: false,
    response: null,
    error: null,
    abort: noop,
  });

  const urlRef = useRef<string>(null);
  const optionsRef = useRef<RequestInit>(null);

  // In order to prevent memory leaks we need to prevent setting state after a component unmounts
  const ignoreRef = useRef(false);
  useEffect(() => {
    return () => {
      ignoreRef.current = true;
    };
  }, [ignoreRef]);

  useEffect(() => {
    // Check for change in url or options
    if (
      url &&
      (urlRef.current !== url || !isEqual(optionsRef.current, options))
    ) {
      urlRef.current = url;
      optionsRef.current = options;
      if (state.loading) {
        state.abort();
      } else {
        const FetchData = async () => {
          try {
            const controller = new AbortController();
            state.loading = true;
            state.response = null;
            state.error = null;
            state.abort = () => controller.abort();
            setState(state);

            const res = await fetch(urlRef.current, {
              signal: controller.signal,
              ...optionsRef.current,
            });
            const response = (await res.json()) as T;

            if (!ignoreRef.current) {
              setState({
                loading: false,
                response,
                error: null,
                abort: noop,
              });
            }
          } catch (error) {
            if (!ignoreRef.current) {
              setState({
                loading: false,
                response: null,
                error,
                abort: noop,
              });
            }
          }
        };

        FetchData();
      }
    }
  }, [url, options, urlRef, optionsRef, state, ignoreRef]);

  return state;
}

function getLabels(projectId: string, success: (data: any) => void) {
  if (projectId) {
    chrome.runtime.sendMessage(
      {
        message: "get_some_labels",
        projectId: projectId,
      },
      function (response) {
        console.info(`reetrieving response: ${JSON.stringify(response)}`);
        success(response && response.data);
      }
    );
  }
}

function FetchLabels({
  projectId,
  callback,
}: {
  projectId: string;
  callback: (data: any) => void;
}) {
  getLabels(projectId, function (data) {
    console.info(`reetrieving callback calling: ${JSON.stringify(data)}`);
    callback(data);
  });
}

export function useProjectLabels(projectId: string): string[] {
  const [labels, setLabels] = useState<string[]>([]);

  // const projectIdRef = useRef<string>(null);
  // // // In order to prevent memory leaks we need to prevent setting state after a component unmounts
  // const ignoreRef = useRef(false);
  // useEffect(() => {
  //   return () => {
  //     ignoreRef.current = true;
  //   };
  // }, [ignoreRef]);

  useMemo(() => {
    if (projectId /*&& projectIdRef.current !== projectId*/) {
      // projectIdRef.current = projectId;
      console.info(`reetrieving labels: ${projectId}`);
      FetchLabels({
        projectId,
        callback: (response: any) => {
          console.info("reetrieving callback");
          // if (!ignoreRef.current) {
            console.info(`reetrieving setting state ${response}`);
            console.info(response);
            setLabels(response as string[]);
          // }
        },
      });
    }
  }, [projectId, setLabels]);

  return labels;
}

// export function useKeydownListener(keyCode: KeyCodes): boolean {
//   const [keyDown, setKeyDown] = useState(false);
//   const onKeyDown = useCallback(
//     (e: KeyboardEvent) => {
//       if (e.keyCode === keyCode) {
//         setKeyDown(true);
//       }
//     },
//     [setKeyDown, keyCode],
//   );

//   const onKeyUp = useCallback(
//     (e: KeyboardEvent) => {
//       if (e.keyCode === keyCode) {
//         setKeyDown(false);
//       }
//     },
//     [setKeyDown, keyCode],
//   );

//   useWindowListener('keydown', onKeyDown);
//   useWindowListener('keyup', onKeyUp);

//   return keyDown;
// }

// detect trackpad "swipes" for paging
// the approach - we track velocity by diving deltaX by the elapsed time since the
// last onWheel event. When the velocity hits a threshold, we page. We then disable
// paging until 2 conditions are met. 1) 500ms elapsed and 2) velocity has returned to
// a low baseline value. This prevents inertial scrolling from triggering multiple
// pageLeft/pageRight events.

// const VELOCITY_THRESHOLD = 3;
// const VELOCITY_RESET_THRESHOLD = 1;
// const SWIPE_TIMEOUT = 500;

// export function useSwipe(onSwipeLeft: Function, onSwipeRight: Function) {
//   const scrollTimeout = useRef<NodeJS.Timeout>(null);
//   const allowScrollPaging = useRef(true);
//   const startTime = useRef(0);
//   const hasMomentum = useRef(false); // prevents really big swipes from scrolling twice

//   const onWheel = useCallback(
//     (e: React.WheelEvent) => {
//       if (startTime.current) {
//         const currTime = performance.now();
//         const diff = currTime - startTime.current;
//         const velocity = e.deltaX / diff;
//         const absV = Math.abs(velocity);
//         if (
//           absV > VELOCITY_THRESHOLD &&
//           allowScrollPaging.current &&
//           !hasMomentum.current
//         ) {
//           // if velocity exceeds threhshold and scrolling is enabled, execute
//           // the swipe callbacks
//           allowScrollPaging.current = false;
//           hasMomentum.current = true;
//           if (velocity > 0) {
//             onSwipeRight();
//           } else {
//             onSwipeLeft();
//           }
//           scrollTimeout.current = setTimeout(() => {
//             startTime.current = 0;
//             allowScrollPaging.current = true;
//           }, SWIPE_TIMEOUT);
//         } else if (hasMomentum.current && absV < VELOCITY_RESET_THRESHOLD) {
//           // when the velocity drops below the reset threshold, reset momentum
//           hasMomentum.current = false;
//           startTime.current = 0;
//         }
//       }
//       startTime.current = performance.now();
//     },
//     [onSwipeLeft, onSwipeRight],
//   );

//   // cleanup scrollTimeout if it's active
//   useEffect(() => {
//     return () => clearTimeout(scrollTimeout.current);
//   }, []);

//   return onWheel;
// }

export const useIsMounted = () => {
  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => (isMounted.current = false);
  }, []);
  return isMounted.current;
};

// const oneSecondInMs = 1000;
// export const useCountdown = () => {
//   const [remainingTimeInSeconds, setRemainingTime] = useState<number>(null);
//   const decrementRemainingTimeTimeout = useRef<NodeJS.Timeout>(null);

//   const clearCountdown = useCallback(() => {
//     clearInterval(decrementRemainingTimeTimeout.current);
//     decrementRemainingTimeTimeout.current = null;
//   }, []);

//   const decrementCountdown = useCallback(() => {
//     decrementRemainingTimeTimeout.current = setInterval(() => {
//       setRemainingTime(
//         remainingTimeInSeconds => Math.floor(remainingTimeInSeconds) - 1,
//       );
//     }, oneSecondInMs);
//   }, []);

//   useEffect(() => {
//     if (remainingTimeInSeconds <= 0) {
//       clearCountdown();
//     } else if (!decrementRemainingTimeTimeout.current) {
//       decrementCountdown();
//     }
//   }, [clearCountdown, decrementCountdown, remainingTimeInSeconds]);

//   useEffect(() => {
//     return clearCountdown;
//   }, [clearCountdown]);

//   return {remainingTimeInSeconds, setRemainingTime};
// };

export const useClickableAndDraggable = (
  _onClick: (e: React.MouseEvent) => void
) => {
  const [fireClickEvent, setFireClickEvent] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);

  const onClick = useMemo(() => (fireClickEvent ? _onClick : null), [
    fireClickEvent,
    _onClick,
  ]);

  const onMouseDown = useCallback(() => {
    setMouseDown(true);
    setFireClickEvent(true);
  }, []);

  return {
    clickableAndDraggableOnMouseDown: onMouseDown,
    clickableAndDraggableOnClick: onClick,
  };
};

export function useInitialRender() {
  const initialRender = useRef(true);

  useEffect(() => {
    return () => (initialRender.current = false);
  });

  return initialRender.current;
}

interface DesktopConfig {
  buildVersion: string;
  copyright: string;
}

export function usePropChangedFlag<T>(
  prop: T
): React.MutableRefObject<boolean> {
  const flagChangedRef = useRef(false);
  const flagChanged = usePropChanged(prop);
  if (flagChanged) {
    flagChangedRef.current = true;
  }
  return flagChangedRef;
}

// only return updated args if ALL the args have updated. used to
// synchronize query changes
export function useSynchronizedChanges<T extends any[]>(
  args: T,
  passthrough = false
): T {
  const changedRef = useRef<boolean[]>(new Array(args.length).fill(false));
  const resultsRef = useRef<T>(args);
  return useMemo((): T => {
    if (!passthrough) {
      for (let i = 0; i < args.length; i++) {
        if (resultsRef.current[i] !== args[i]) {
          changedRef.current[i] = true;
        } else if (!changedRef.current[i]) {
          return resultsRef.current;
        }
      }
    }
    resultsRef.current = args;
    changedRef.current = changedRef.current.map(() => false);
    return resultsRef.current;
  }, [args, passthrough]);
}

export function useLoadImageInBackground(
  imageUrl,
  onLoad: (url: string) => void
) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const loadImageInBackground = useCallback(
    (url, onLoadCallback: (url: string) => void) => {
      let preloadedImage = document.createElement("img");
      preloadedImage.src = url;
      setImageLoaded(false);

      preloadedImage.addEventListener("load", () => {
        setImageLoaded(true);
        onLoadCallback(url);
        preloadedImage = null;
      });
    },
    []
  );

  useEffect(() => {
    loadImageInBackground(imageUrl, () => onLoad(imageUrl));
  }, [imageUrl, onLoad, loadImageInBackground]);

  return { imageLoaded };
}
