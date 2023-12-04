<%@page import="java.sql.*"%>
<%@ page language="java" contentType="application/json; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
Connection conn = null;
ResultSet rs = null;
PreparedStatement pstmt;
StringBuilder jsonBuilder = new StringBuilder();

String jdbcUrl = "jdbc:mysql://localhost:3306/mapmoji";
String dbId = "root";
String dbPwd = "asdf9";

try {
	Class.forName("com.mysql.jdbc.Driver");
	conn = DriverManager.getConnection(jdbcUrl, dbId, dbPwd);
	String sql = "SELECT * FROM pinmemojis";
	pstmt = conn.prepareStatement(sql);

	rs = pstmt.executeQuery();

	jsonBuilder.append("[");
	boolean firstRow = true;

	while (rs.next()) {
		if (!firstRow) {
	jsonBuilder.append(",");
		} else {
	firstRow = false;
		}

		jsonBuilder.append("{");
		jsonBuilder.append("\"id\":\"").append(rs.getString("id")).append("\",");
		jsonBuilder.append("\"latitude\":").append(rs.getDouble("latitude")).append(",");
		jsonBuilder.append("\"longitude\":").append(rs.getDouble("longitude")).append(",");
		jsonBuilder.append("\"content\":\"").append(rs.getString("content").replace("\"", "\\\"")).append("\"");
		jsonBuilder.append("}");
	}

	jsonBuilder.append("]");

	out.println(jsonBuilder.toString()); // JSON 출력

	rs.close();
	pstmt.close();
	conn.close();

} catch (Exception ex) {
	out.println("연결 오류입니다. 오류 메시지: " + ex.getMessage());
}
%>