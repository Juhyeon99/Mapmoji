<%@page import="java.sql.*"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>MySQl 연결 드라이버 테스트</title>
</head>
<body>
	<h1>MySQL 연결 드라이버 테스트</h1>
	<%
String jdbcUrl = "jdbc:mysql://localhost:3306/mapmoji";
String dbId = "root";
String dbPwd = "asdf9";

try {
	Class.forName("com.mysql.jdbc.Driver");
	Connection connection = DriverManager.getConnection(jdbcUrl, dbId, dbPwd);
	out.println("MySQL 연결 성공");
} catch (Exception ex) {
	out.println("연결 오류입니다. 오류 메시지 : " + ex.getMessage());
}
%>

</body>
</html>

