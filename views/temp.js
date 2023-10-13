<% if (locals.name && locals.code) { %> <
form class = "form"
action = "/<%= locals.name %>-<%= locals.code %>/distance"
method = "POST" > < /form>
<% } else if (locals.dataOne) { %> <
form class = "form"
action = "/<%= locals.dataOne.name %>-<%= locals.dataOne.code %>/distance"
method = "POST" > < /form>
<% } %>