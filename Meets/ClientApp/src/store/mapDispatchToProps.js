import { bindActionCreators } from 'redux';
import { UpdateUserInfo, } from './appActions';

// здесь выполняется маппинг обработчиков действий с полями пропсов компонентов

function mapDispatchToProps(component) {

	return function (dispatch) {
		return {
			// этот метод появится в props
			UpdateUserInfo: bindActionCreators(UpdateUserInfo, dispatch),
		};
	};
}

export default mapDispatchToProps;