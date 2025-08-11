// Higher-Order Component (HOC) trong React, dùng để quản lý quyền truy cập vào các trang công khai (public pages).
function PublicRoute({children}){
    return children;
}
export default PublicRoute;