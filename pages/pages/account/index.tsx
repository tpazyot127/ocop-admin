import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

export default function UserDetail() {
    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Cài đặt tài khoản</h5>
                    <div className="p-fluid">
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <InputText id="email" type="text" placeholder="Nhập email" />
                        </div>
                        <div className="field">
                            <label htmlFor="username">Tên tài khoản</label>
                            <InputText id="username" type="text" placeholder="Nhập tên tài khoản" />
                        </div>
                    </div>
                    <Button label="Submit" className="w-full md:w-auto"></Button>
                </div>
            </div>
            <div className="col-12">
                <div className="card">
                    <h5>Cài đặt mật khẩu</h5>
                    <div className="p-fluid">
                        <div className="field">
                            <label htmlFor="current_password">Mật khẩu hiện tại</label>
                            <InputText id="current_password" type="text" placeholder="Nhập mật khẩu hiện tại" />
                        </div>
                        <div className="field">
                            <label htmlFor="new_password">Mật khẩu mới</label>
                            <InputText id="new_password" type="text" placeholder="Nhập mật khẩu mởi" />
                        </div>
                        <div className="field">
                            <label htmlFor="confirm_password">Xác nhận mật khẩu</label>
                            <InputText id="confirm_password" type="text" placeholder="Xác nhận mật khẩu" />
                        </div>
                    </div>
                    <Button label="Submit" className="w-full md:w-auto"></Button>
                </div>
            </div>
        </div>
    );
}
