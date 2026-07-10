import { SiteHeader, SiteFooter } from '../../../components/Site';

export const metadata = {
  title: 'Liên hệ',
  description: 'Liên hệ Calcroo.',
  alternates: { canonical: '/vi/lien-he/', languages: { en: '/contact/', vi: '/vi/lien-he/' } },
};

export default function Page() {
  return (
    <>
      <SiteHeader homeHref="/vi/" langHref="/contact/" langLabel="English" />
      <main className="wrap legal">
        <h1>Liên hệ</h1>
        <p>Thấy con số nào đó sai sai, hay ước có một công cụ chưa tồn tại? Chúng tôi thật lòng muốn nghe — báo cáo sai số liệu luôn được trả lời trước tiên. Nhắn tiếng Việt thoải mái.</p>
        <p>Email: <a href="mailto:hello@calcroo.au">hello@calcroo.au</a></p>
        <p>Chúng tôi cố gắng phản hồi trong vài ngày làm việc. Câu hỏi thuế gấp, gọi ATO 13 28 61 (có thể yêu cầu thông dịch viên qua TIS 131 450) hoặc tax agent có đăng ký.</p>
      </main>
      <SiteFooter vi />
    </>
  );
}
