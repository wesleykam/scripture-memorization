import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Game from './sections/game/game';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: Infinity,
    },
  },
});

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <Game />
            <div className="mobile-warning">
                <h1>Warning!</h1>
                <p>
                    This game is not optimized for mobile devices. Please play
                    on a desktop.
                </p>
            </div>
        </QueryClientProvider>
    );
};

export default App;
