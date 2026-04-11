<?php

namespace App\Notifications;

use App\Models\LayananSubmission;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class StatusLayananNotification extends Notification
{
    use Queueable;

    private array $statusLabels = [
        'pending'  => 'Menunggu',
        'diproses' => 'Sedang Diproses',
        'selesai'  => 'Selesai',
        'ditolak'  => 'Ditolak',
    ];

    public function __construct(public LayananSubmission $layanan) {}

    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $statusLabel = $this->statusLabels[$this->layanan->status] ?? $this->layanan->status;

        $mail = (new MailMessage)
            ->subject("[{$this->layanan->jenis_layanan}] {$this->emailSubject()}")
            ->greeting("Halo, {$notifiable->name}!")
            ->line("Status permohonan layanan Anda telah diperbarui menjadi **{$statusLabel}**.")
            ->line("**Jenis Layanan:** {$this->layanan->jenis_layanan}")
            ->line("**Tanggal Pengajuan:** " . $this->layanan->created_at->translatedFormat('d F Y'));

        if ($this->layanan->status === 'ditolak' && $this->layanan->catatan_admin) {
            $mail->line('---')
                 ->line('**Alasan Penolakan:**')
                 ->line($this->layanan->catatan_admin)
                 ->line('---')
                 ->line('Jika ada pertanyaan, silakan datang langsung ke kantor desa.');
        }

        if ($this->layanan->status === 'selesai') {
            $mail->line('Silakan datang ke kantor desa untuk mengambil dokumen/hasil layanan Anda.');
        }

        return $mail->salutation('Salam, ' . config('app.name'));
    }

    public function toDatabase(object $notifiable): array
    {
        $statusLabel = $this->statusLabels[$this->layanan->status] ?? $this->layanan->status;

        return [
            'layanan_id'    => $this->layanan->id,
            'jenis_layanan' => $this->layanan->jenis_layanan,
            'status'        => $this->layanan->status,
            'status_label'  => $statusLabel,
            'catatan_admin' => $this->layanan->catatan_admin,
            'message'       => $this->buildMessage($statusLabel),
            'icon'          => $this->statusIcon(),
        ];
    }

    private function emailSubject(): string
    {
        return match ($this->layanan->status) {
            'diproses' => 'Permohonan Anda Sedang Diproses',
            'selesai'  => 'Permohonan Anda Telah Selesai',
            'ditolak'  => 'Permohonan Anda Ditolak',
            default    => 'Update Status Permohonan',
        };
    }

    private function buildMessage(string $statusLabel): string
    {
        return match ($this->layanan->status) {
            'diproses' => "Permohonan \"{$this->layanan->jenis_layanan}\" Anda sedang diproses oleh petugas.",
            'selesai'  => "Permohonan \"{$this->layanan->jenis_layanan}\" Anda telah selesai.",
            'ditolak'  => "Permohonan \"{$this->layanan->jenis_layanan}\" Anda ditolak. Lihat detail untuk alasan penolakan.",
            default    => "Status permohonan \"{$this->layanan->jenis_layanan}\" Anda diperbarui menjadi {$statusLabel}.",
        };
    }

    private function statusIcon(): string
    {
        return match ($this->layanan->status) {
            'diproses' => 'info',
            'selesai'  => 'success',
            'ditolak'  => 'error',
            default    => 'warning',
        };
    }
}