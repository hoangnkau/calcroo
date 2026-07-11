import SignatureMaker from '../../../components/SignatureMaker';
import { SiteHeader, SiteFooter } from '../../../components/Site';
import Link from 'next/link';

export const metadata = {
  title: 'Tạo Chữ Ký Online — Vẽ & Tải PNG Nền Trong Suốt, Miễn Phí',
  description:
    'Vẽ chữ ký hoặc upload ảnh chụp chữ ký thật để tự động tách nền giấy — tải về PNG nền trong suốt chèn vào hợp đồng, form, PDF. Miễn phí, ngay trên trình duyệt — không bao giờ upload.',
  alternates: {
    canonical: '/vi/tao-chu-ky/',
    languages: { en: '/signature-maker/', vi: '/vi/tao-chu-ky/' },
  },
};

const FAQ = [
  {
    q: 'Chèn chữ ký này vào PDF hoặc Word như thế nào?',
    a: 'Tải PNG về, rồi: Word/Google Docs dùng Insert → Image, kéo lên dòng ký; app PDF (Adobe Reader, Preview trên Mac, app điện thoại) dùng chức năng thêm ảnh hoặc fill-and-sign rồi chọn file. Nền trong suốt nên không có ô trắng đè lên giấy tờ.',
  },
  {
    q: 'Chữ ký dạng ảnh có giá trị pháp lý ở Úc không?',
    a: 'Với đa số giấy tờ đời thường — hợp đồng thuê nhà, form nhận việc, giấy đồng ý — chữ ký điện tử (gồm cả ảnh) thường được chấp nhận theo Electronic Transactions Act nếu các bên đồng ý. Một số giấy tờ vẫn đòi ký tươi hoặc có người chứng kiến (một số statutory declaration, di chúc, vài giao dịch đất đai). Khi quan trọng, hỏi trước nơi yêu cầu.',
  },
  {
    q: 'Chữ ký của tôi có bị upload hay lưu ở đâu không?',
    a: 'Không. Vẽ trên canvas trong trình duyệt, PNG tạo ngay trên máy bạn, đóng tab là mất hết. Chữ ký chính là thứ bạn không muốn trôi nổi trên mạng — nên toàn bộ công cụ được thiết kế để nó không bao giờ rời máy.',
  },
  {
    q: 'Nên vẽ trên điện thoại hay máy tính?',
    a: 'Điện thoại — ngón tay trên màn hình cảm ứng cho nét ký tự nhiên hơn hẳn chuột. Mở trang này trên điện thoại, ký bằng ngón tay, tải về — file PNG nằm ngay trong máy, sẵn sàng chèn hoặc gửi cho chính mình.',
  },
  {
    q: 'Nên chọn bút màu gì?',
    a: 'Đen là mặc định an toàn, scan ra sạch. Xanh được chuộng vì nhìn rõ là chữ ký "mới thêm vào" chứ không phải photo lại — nhiều người thích vậy trên hợp đồng. Có sẵn cả hai.',
  },
  {
    q: 'Dùng ảnh chụp chữ ký thật thay vì vẽ được không?',
    a: 'Được — chuyển sang tab “Từ ảnh chụp”. Ký bút mực đậm trên giấy trơn, chụp thẳng từ trên xuống dưới ánh sáng đều, công cụ tự tách nền giấy (khử được cả bóng đổ nhẹ), tự crop sát chữ ký và xuất PNG trong suốt. Có thanh chỉnh để tinh chỉnh nếu nét mảnh bị mất hoặc còn sót bóng.',
  },
];

export default function Page() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return (
    <>
      <SiteHeader homeHref="/vi/" langHref="/signature-maker/" langLabel="English" />
      <main className="wrap">
        <section className="hero">
          <div className="fy-chip">Client-side · không bao giờ upload</div>
          <h1>Tạo Chữ Ký Online</h1>
          <p>
            Vẽ chữ ký — hoặc chụp chữ ký thật rồi để công cụ tự tách nền giấy — sau đó tải PNG trong suốt cho mọi form,
            hợp đồng. Miễn phí, trên trình duyệt, không bao giờ upload.
          </p>
        </section>

        <SignatureMaker lang="vi" />

        <article className="content">
          <h2>Bước cuối của mọi bộ hồ sơ</h2>
          <p>
            Hợp đồng thuê nhà lúc 9 giờ tối, form nhận việc hạn sáng mai, giấy đồng ý cho trường của con — tất cả cần
            chữ ký đúng lúc máy in hết mực hoặc không tồn tại. Nghi thức in-ký-scan đã lỗi thời: vẽ một lần ở đây
            (ngón tay trên điện thoại đẹp nhất), giữ file PNG, và ký giấy tờ trong vài giây suốt nhiều năm. Nền trong
            suốt nên chữ ký nằm trên trang như mực thật, không phải miếng dán trắng.
          </p>
          <h2>Trọn bộ đồ nghề giấy tờ</h2>
          <p>
            Chữ ký xong, phần còn lại của xấp hồ sơ cũng có đủ đồ: lấy đúng trang với{' '}
            <Link href="/vi/tach-pdf/">Tách PDF</Link>, nén bản scan với{' '}
            <Link href="/vi/nen-anh-giay-to/">Nén Ảnh Giấy Tờ</Link>, và ghim tất cả thành một file với{' '}
            <Link href="/vi/gop-pdf/">Gộp PDF</Link>.
          </p>
          <h2>Câu hỏi thường gặp</h2>
          {FAQ.map((f) => (
            <div className="faq-item" key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}
          <p className="disclaimer">
            Thông tin chung — chữ ký điện tử có được chấp nhận hay không phụ thuộc loại giấy tờ và các bên; một số
            giấy tờ luật định phải ký tươi hoặc có người chứng kiến. Khi không chắc, hỏi nơi yêu cầu. Chữ ký được tạo
            ngay trên máy, không bao giờ upload lên Calcroo.
          </p>
        </article>
      </main>
      <SiteFooter vi />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}
