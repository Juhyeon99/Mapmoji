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
	Connection conn = null;
	PreparedStatement pstmt;

	String jdbcUrl = "jdbc:mysql://localhost:3306/mapmoji";
	String dbId = "root";
	String dbPwd = "asdf9";

	try {
		Class.forName("com.mysql.jdbc.Driver");
		conn = DriverManager.getConnection(jdbcUrl, dbId, dbPwd);
		String sql = "insert into memojis values(?,?,?,?)";
		pstmt = conn.prepareStatement(sql);

		pstmt.setString(1, request.getParameter("id"));
		pstmt.setString(2, request.getParameter("x"));
		pstmt.setString(3, request.getParameter("y"));
		pstmt.setString(4, request.getParameter("content"));
		pstmt.executeUpdate();

		out.println("ID: " + request.getParameter("id"));
		out.println("Latitude: " + request.getParameter("latitude"));
		out.println("Longitude: " + request.getParameter("longitude"));
		out.println("Content: " + request.getParameter("content"));

		out.println("연결 성공");

		out.println("MySQL 연결 성공");
	} catch (Exception ex) {
		out.println("연결 오류입니다. 오류 메시지 : " + ex.getMessage());
	}
%>
</body>
</html>