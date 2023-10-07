// 部分代码
import useAppTrackHook from '../hooks/useAppTrackHook';

const App = ({ Component, ...pageProps }: { Component: React.ComponentType }) => {
const [eventDataRef] = useAppTrackHook();
    return (
    // 当我们需要传递参数时也可以在tsx中包裹<DataEventProvider></DataEventProvider>
        <DataEventProvider ref={eventDataRef} evtData={{ root: 'hybrid', appid: '264482' }}>
          <div id="app">
            <Component {...pageProps} />
          </div>
        </DataEventProvider>
    )
}