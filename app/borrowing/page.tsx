'use client';

export default function Borrowing() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Borrowing Privileges</h1>

        <div className="prose max-w-none space-y-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <p>All students, faculty members and staff of BRAC University with valid IDs are automatically members of the Library.</p>
            <p>Patrons must use their valid ID card to access library services and resources.</p>
            <p>Journals, magazines, newspapers and Reference Collection items are not for loan.</p>
            <p>Patrons in the following categories may borrow items from BRAC University library. See the table below to see additional information on library privileges and loan periods.</p>
          </div>

          <section>
            <h2 className="text-2xl font-bold">Returning & Renewing Items</h2>
            
            <div className="bg-white shadow-md rounded-lg p-6 mt-4">
              <h3 className="text-xl font-semibold mb-4">Renewal</h3>
              <p>Items on loan may be renewed if no request is placed for those items.</p>
              <p className="font-semibold mt-2">Renewals may be done in the following ways:</p>
              <ul className="list-disc pl-5 mt-2">
                <li>Online catalogue (<a href="https://library.bracu.ac.bd/opac" className="text-blue-600 hover:text-blue-800">https://library.bracu.ac.bd/opac</a>)</li>
                <li>Presenting the items at circulation desk.</li>
                <li>Via telephone (880-2-9844051-4 Ext: 4052 or 04478444068).</li>
              </ul>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 mt-4">
              <h3 className="text-xl font-semibold mb-4">Return</h3>
              <ul className="list-disc pl-5">
                <li>Members must return/renew items borrowed within the due date range.</li>
                <li>Items must be returned to Ayesha Abed Library, BRAC University.</li>
              </ul>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 mt-4">
              <h3 className="text-xl font-semibold mb-4">Holds</h3>
              <ul className="list-disc pl-5">
                <li>Holds may be placed for materials that are currently checked out.</li>
                <li>One can place hold through the online catalogue system.</li>
                <li>Borrowers will be notified for pick-up when the item is returned.</li>
              </ul>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 mt-4">
              <h3 className="text-xl font-semibold mb-4">Recall</h3>
              <ul className="list-disc pl-5">
                <li>Borrower can recall for currently loaned items in urgent need by contacting circulation desk.</li>
                <li>BRAC University library reserves the right to recall borrowed materials before the due date.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold">Overdue & Fines</h2>
            
            <div className="bg-white shadow-md rounded-lg p-6 mt-4">
              <h3 className="text-xl font-semibold mb-4">Overdue</h3>
              <ul className="list-disc pl-5">
                <li>Item/s will be considered as overdue if any user fails to return or renew the item/s within the due date range</li>
                <li>Borrower will not be able to borrow if he/she has overdue.</li>
                <li>Borrowing privileges will be suspended until the item/s is/are returned and the penalty for non-returned item/s is/are paid.</li>
                <li>Notices will be served through e-mail to student/staff e-mail accounts.</li>
                <li>Borrowers are responsible for checking that e-mail account.</li>
              </ul>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 mt-4">
              <h3 className="text-xl font-semibold mb-4">Fines</h3>
              <ul className="list-disc pl-5">
                <li>Tk. 5.00 (Five) only per calendar day for each Book item (BK).</li>
                <li>Tk. 5.00 (Five) only per hour for One Hour Loan Items (1-Hour).</li>
                <li>Tk. 10.00 (Ten) only per calendar day for each Audio Visual item (AV).</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold">Lost Items</h2>
            
            <div className="bg-white shadow-md rounded-lg p-6 mt-4">
              <p>If the borrowed item(s) is/are not returned within 6 (six) weeks, the item(s) will be considered as lost.</p>
              <p className="font-semibold mt-4">Item(s) lost by the borrower must be:</p>
              <ul className="list-disc pl-5 mt-2">
                <li>Replaced by a new copy of the same item or</li>
                <li>The latest edition of the same item or</li>
                <li>Pay a replacement cost two times current market price of the borrowed item(s)</li>
              </ul>
              <p className="mt-4">The borrower will be solely liable for the full replacement of cost and accumulated fines for the item(s) borrowed.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}