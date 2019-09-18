module.exports = {
    html: function(authStatusUI='<a href="/auth/facebook">Facebook login</a>'){
        return `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">   
                <title>List Page</title>
            </head>
            <body>
                ${authStatusUI}
                <hr>
                <h1>List page</h1>
                <a href="/insert">INSERT DATA</a> 
                <hr>
                <table width="100%" border="1">
                    <tr>
                        <th>Number</th>
                        <th>DELETE</th>
                        <th>Email</th>
                        <th>Title</th>
                        <th>Content</th>
                    </tr>
                    <% html.forEach(function (item, index) { %>
                    <tr>
                        <td><%= item.number %>번</td>
                        <td><a href="/delete/<%= item.number %>">DELETE</a></td>
                        <td><%= item.email %></td>
                        <td><a href="/question/<%= item.number %>"><%= item.title %></td>
                        <td><%= item.content %></td>
                    </tr>
                    <% }); %>
                </table>
            </body>
        </html>`;
    }
}