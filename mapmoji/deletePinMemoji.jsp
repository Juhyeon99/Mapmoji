<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@page import="java.sql.*"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
</head>
<body>

<%
	// 클라이언트로부터 전달된 id 매개변수 가져오기
	String id = request.getParameter("id");

	// 데이터베이스 연결 정보
	String jdbcUrl = "jdbc:mysql://localhost:3306/mapmoji";
	String dbId = "root";
	String dbPwd = "asdf9";

	Connection conn = null;
	PreparedStatement pstmt = null;

	try {
		Class.forName("com.mysql.jdbc.Driver");
		conn = DriverManager.getConnection(jdbcUrl, dbId, dbPwd);
		String sql = "DELETE FROM pinmemojis WHERE id = ?";
		pstmt = conn.prepareStatement(sql);
		pstmt.setString(1, id);
		int rowsAffected = pstmt.executeUpdate();

		if (rowsAffected > 0) {
			// 삭제가 성공했을 경우
			out.println("Memoji with ID " + id + " has been deleted.");
		} else {
			// 해당 ID를 가진 Memoji가 없을 경우
			out.println("Memoji with ID " + id + " not found.");
		}
	} catch (Exception ex) {
		out.println("연결 오류입니다. 오류 메시지 : " + ex.getMessage());
	}
%>
</body>
</html>