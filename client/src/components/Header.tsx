export default function Header() {
  return (
    <header className="bg-[#7B2D8E] py-5" data-testid="header">
      <div className="flex items-center justify-center">
        <a href="/" className="flex items-center" data-testid="logo-link">
          <svg width="140" height="36" viewBox="0 0 140 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <text x="10" y="28" fontFamily="Inter" fontWeight="800" fontSize="26" fill="#FFFFFF">livelo</text>
            <circle cx="126" cy="14" r="5" fill="#FF6600" />
          </svg>
        </a>
      </div>
    </header>
  );
}
