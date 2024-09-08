using Microsoft.AspNetCore.OData.Query.Expressions;
using Microsoft.OData.UriParser;
using System.Linq.Expressions;
using user_api.Users;

namespace user_api;

public class UserSerachBinder : QueryBinder, ISearchBinder
{
    public Expression BindSearch(SearchClause searchClause, QueryBinderContext context)
    {
        var node = searchClause.Expression as SearchTermNode;
        var text = node?.Text.ToLower();

        Expression<Func<User, bool>> exp = p =>
            p.FirstName.ToLower().Contains(text)
            || p.LastName.ToLower().Contains(text)
            || p.Email.ToLower().Contains(text);

        return exp;
    }
}
