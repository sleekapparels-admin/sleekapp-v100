-- Enable realtime for production_stages table
ALTER TABLE public.production_stages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.production_stages;

-- Enable realtime for order_updates table  
ALTER TABLE public.order_updates REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_updates;