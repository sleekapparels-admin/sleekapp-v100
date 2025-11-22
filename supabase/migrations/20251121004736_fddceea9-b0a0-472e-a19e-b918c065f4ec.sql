-- Create storage bucket for message attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('message-attachments', 'message-attachments', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for message-attachments bucket
-- Users can upload files to their own folder
CREATE POLICY "Users can upload their own attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'message-attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can view files from their conversations
CREATE POLICY "Users can view their conversation attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'message-attachments' AND
  (
    -- Can view their own uploads
    auth.uid()::text = (storage.foldername(name))[1] OR
    -- Or files from messages they're part of (sender or recipient)
    EXISTS (
      SELECT 1 FROM public.messages m
      WHERE m.attachments @> ARRAY[storage.objects.name]::text[]
      AND (m.sender_id = auth.uid() OR m.recipient_id = auth.uid())
    )
  )
);

-- Users can delete their own attachments
CREATE POLICY "Users can delete their own attachments"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'message-attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);