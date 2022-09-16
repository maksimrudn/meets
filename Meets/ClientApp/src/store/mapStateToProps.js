
// ����� ����������� ������� ����� ��������� � �������� ����������
// � ���������� � ������� ���������� �������� �� ����, ������� ���� � ���������, ���������� return
function mapStateToProps(component) {
	switch (component) {
		case "App": 
		case "TopMenu": 
		case "LeftMenu": 
		case "Layout": 
		case "UserCard":
		case 'MeetingList':	{
			return function (state) {
				return {
					userInfo: state.userInfo,
				}
			}
		}



		default: {
			return function (state) {
				return {
					userInfo: state.userInfo,
				}
			}
		}
	}
}

export default mapStateToProps;