import ReactDOM from 'react-dom/client';
import App from './App';
import Styles from './styles';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
	<Styles>
		<App />
	</Styles>
);
