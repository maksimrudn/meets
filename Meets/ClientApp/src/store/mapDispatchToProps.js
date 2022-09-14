import { bindActionCreators } from 'redux';
import { UpdateUserInfo, } from './appActions';

// ����� ����������� ������� ������������ �������� � ������ ������� �����������

function mapDispatchToProps(component) {

	return function (dispatch) {
		return {
			// ���� ����� �������� � props
			UpdateUserInfo: bindActionCreators(UpdateUserInfo, dispatch),
		};
	};
}

export default mapDispatchToProps;