export function InitialAppLoader() {
  return (
    <>
      <div
        id="loader-wrapper"
        className="p-3 fixed inset-0 z-[9999] flex items-center justify-center bg-white"
      >
        <div className="loader" />
      </div>
    </>
  );
}
