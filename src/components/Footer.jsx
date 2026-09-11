function Footer() {
    return (
        <footer className="border-t border-gray-200 bg-white px-4 py-4 text-center text-sm text-gray-500 md:px-6">
            © {new Date().getFullYear()} Inventory Management System. All rights reserved.
        </footer>
    );
}

export default Footer;
